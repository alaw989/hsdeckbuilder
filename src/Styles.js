import styled from "styled-components";

const Banner = styled.div`
  background-image: url('warlockbg.jpg');
  padding: 200px;
  background-size: cover;
`;

const DeckBuilderCardGrid = styled.div`
    ul {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
    }
`;

export { Banner, DeckBuilderCardGrid };
