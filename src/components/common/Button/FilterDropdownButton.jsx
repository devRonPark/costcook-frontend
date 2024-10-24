import React from 'react';
import styled from 'styled-components';

export const FilterDropdownButton = ( {handleSortChange }) => {
    return (
        <DropdownContainer>
            <StyledSelect onChange={handleSortChange}>
                <option value="createdAt">등록일 순</option>
                <option value="avgRatingsDesc">평점 높은 순</option>
                <option value="avgRatingsAsc">평점 낮은 순</option>
                <option value="viewCountDesc">조회수 높은 순</option>
                <option value="viewCountAsc">조회수 낮은 순</option>
            </StyledSelect>
        </DropdownContainer>
    )
};

const DropdownContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin: 10px;
`;

const StyledSelect = styled.select`
    font-size: 14px;
    border: 0px solid white;
    border-radius: 4px;
    background-color: white;
    color: black;
`