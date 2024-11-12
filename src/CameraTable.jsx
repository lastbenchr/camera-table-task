// CameraTable.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import cameraData from "./constants";
import brand from "./assets/brand.png";
import { FaSearch } from "react-icons/fa";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineWbCloudy,
} from "react-icons/md";
import { RxCircleBackslash } from "react-icons/rx";
import { BsHddStack } from "react-icons/bs";

export default function CameraTable() {
  const [cameraData, setCameraData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

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
        setCameraData(data.data); // Assuming data structure has a "data" property
        setTotalItems(data.data.length); // Get total number of items from the API response
      } else {
        console.error("Failed to fetch data:", response.status);
      }
    } catch (error) {
      console.log("Error Fetching Data:, error");
    }
  };

  useEffect(() => {
    fetchCameraData();
  }, []);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cameraData.slice(startIndex, endIndex);

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

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
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
          <SearchInput placeholder="Search" />
          <FaSearch />
        </SearchBar>
      </Header>

      <Filters>
        <Dropdown>
          <option>Location</option>
          {/* Add location options here */}
        </Dropdown>
        <Dropdown>
          <option>Status</option>
          {/* Add status options here */}
        </Dropdown>
      </Filters>
      <div style={{ overflowX: "auto" }}>
        <Table>
          <TableHeader>
            <Row>
              <HeaderCell>Name</HeaderCell>
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
                  <input type="checkbox" /> {item.name}
                </Cell>
                <Cell>
                  <HealthColumn>
                    <MdOutlineWbCloudy />
                    {}
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
                <Cell>
                  <StatusBadge status={item.status}>{item.status}</StatusBadge>
                </Cell>
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
          {/* Dropdown for selecting items per page */}
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
          onClick={handleFirstPage}
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
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
}

// syling of table goes here.....
const Container = styled.div`
  padding: 35px;
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
