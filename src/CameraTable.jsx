import React, { useEffect, useState } from "react";
import styled from "styled-components";
import brand from "./assets/brand.png";
import { FaSearch } from "react-icons/fa";
import { MdOutlineWbCloudy } from "react-icons/md";
import { RxCircleBackslash } from "react-icons/rx";
import { BsHddStack } from "react-icons/bs";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowRight,
  MdDelete,
} from "react-icons/md";

export default function CameraTable() {
  const [cameraData, setCameraData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // Fetch data initially and save it to localStorage
    const storedData = localStorage.getItem("cameraData");
    if (storedData) {
      setCameraData(JSON.parse(storedData));
    } else {
      fetchCameraData();
    }
  }, []);

  useEffect(() => {
    // Filter the data whenever any filter changes
    filterData();
  }, [cameraData, locationFilter, statusFilter, searchQuery]);

  const fetchCameraData = async () => {
    const url = "https://api-app-staging.wobot.ai/app/v1/fetch/cameras";
    const token = "4ApVMIn5sTxeW7GQ5VWeWiy";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCameraData(data.data);
        localStorage.setItem("cameraData", JSON.stringify(data.data)); // Store data in localStorage
      } else {
        console.error("Failed to fetch data:", response.status);
      }
    } catch (error) {
      console.log("Error Fetching Data:", error);
    }
  };

  const handleDelete = () => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete selected items?")) {
      // Filter out the selected items
      const newData = cameraData.filter(
        (item) => !selectedItems.includes(item.id)
      );

      // Update state with the remaining items
      setCameraData(newData);
      setSelectedItems([]); // Reset selected items
    }
  };

  const filterData = () => {
    let filtered = cameraData;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.recorder.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter((item) =>
        item.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((item) =>
        item.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setTotalItems(filtered.length);
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id]
    );
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <Container>
      <ImageWrapper>
        <img src={brand} alt="brand logo" height="60px" />
      </ImageWrapper>
      <Header>
        <TitleSection>
          <Title>Cameras</Title>
          <Subtitle>Manage your cameras here.</Subtitle>
        </TitleSection>
        <SearchBar>
          <SearchInput
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch />
        </SearchBar>
      </Header>

      <Filters>
        <Dropdown
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">Location</option>
          <option value="Denver, CO">Denver, CO</option>
          <option value="San Diego, CA">San Diego, CA</option>
          <option value="Chicago, IL">Chicago, IL</option>
        </Dropdown>
        <Dropdown
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Dropdown>
      </Filters>
      <div style={{ overflowX: "auto" }}>
        <Table>
          <TableHeader>
            <Row>
              <HeaderCell>
                <ActionBox>
                  Name
                  {selectedItems.length > 0 && (
                    <MdDelete
                      onClick={() => handleDelete()}
                      color="tomato"
                      size={20}
                      cursor={"pointer"}
                    />
                  )}
                </ActionBox>
              </HeaderCell>
              <HeaderCell>Health</HeaderCell>
              <HeaderCell>Location</HeaderCell>
              <HeaderCell>Recorder</HeaderCell>
              <HeaderCell>Tasks</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Actions</HeaderCell>
            </Row>
          </TableHeader>
          <tbody>
            {currentItems.map((item) => (
              <Row key={item._id}>
                <Cell>
                  <ActionBox>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    {item.name}
                  </ActionBox>
                </Cell>

                <Cell>
                  <HealthColumn>
                    <MdOutlineWbCloudy />
                    <Circle color={item.health.cloud}>
                      {item.health.cloud}
                    </Circle>
                    <BsHddStack />
                    <Circle color={item.health.device}>
                      {item.health.device}
                    </Circle>
                  </HealthColumn>
                </Cell>
                <Cell>{item.location}</Cell>
                <Cell>{item.recorder || "N/A"}</Cell>
                <Cell>{item.tasks}</Cell>
                <Cell>{item.status}</Cell>
                <Cell>
                  <RxCircleBackslash color="grey" />
                </Cell>
              </Row>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination>
        <div>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <span style={{ marginRight: "12px" }}>
          {startIndex + 1}-{endIndex} of {totalItems}
        </span>
        <MdOutlineKeyboardDoubleArrowLeft
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <MdKeyboardArrowLeft
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        />
        <MdKeyboardArrowRight
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        />
        <MdOutlineKeyboardDoubleArrowRight
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
}

// syling of table goes here.....
const Container = styled.div`
  padding: 35px;

  /* Example media query for smaller screens */
  @media (max-width: 768px) {
    padding: calc(10px + 2vw);
  }

  @media (min-width: 1200px) {
    padding: calc(40px + 1vw);
  }
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 0px;
`;

const Subtitle = styled.p`
  color: gray;
  //   margin: 0px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 10px;
  background-color: #f9f9f9;
  max-width: 325px;
  width: 100%;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  border-radius: 5px;
  font-size: 16px;
  background-color: inherit;
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  background-color: white;
  padding: 10px;
`;

const Dropdown = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 200px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  font-size: 14px;
`;

const TableHeader = styled.thead`
  color: grey;
  text-transform: uppercase;
  font-size: 14px;
`;

const HeaderCell = styled.th`
  padding: 20px;
  //   border: 1px solid #ddd;
  text-align: left;
`;

const Row = styled.tr`
  border-bottom: 1px solid #ddd;
  font-size: 14px;
`;

const Cell = styled.td`
  padding: 20px;
  text-align: left;
  min-width: 90px;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  font-weight: bold;
  border-radius: 4px;
  color: ${(props) => (props.status === "Active" ? "green" : "#7d7d7d")};
  background-color: ${(props) =>
    props.status === "Active" ? "#e6f4ef" : "#e5e5e5"};
`;

const Pagination = styled.div`
    color: grey;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 12px;
    gap: 7px;
    background-color: white;
     svg {
      cursor: pointer;
      font-size:20px;
     }

     select {
          margin-right: 20px;
    outline: none;
    border: none;
    color: grey;
    font-size: 16px;
     }
}
`;

const HealthColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const Circle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px; /* Adjust size as needed */
  height: 20px;
  border-radius: 50%;
  position: relative;
  font-size: 14px;
  font-weight: bold;
  color: #555; /* Text color */
  background-color: white; /* Circle background */

  /* Pseudo-element to create the half-colored, half-gray border */
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: conic-gradient(
      ${({ color }) => (color == "A" ? "green" : "orange")} 0% 80%,
      lightgray 50% 100%
    );
    -webkit-mask: radial-gradient(closest-side, transparent 74%, black)
      border-box;
    mask: radial-gradient(closest-side, transparent 74%, black) border-box;
  }
`;

const ActionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
