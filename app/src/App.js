import React, {useEffect} from 'react';
import styled from "styled-components";
import {Col, Row} from "react-bootstrap";

const HeroContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ColumnTitles = styled.h1`
    font-size: 2.3rem;
    font-family: "Hack";
    font-weight: bold;
    color: white;
    
    @media (min-width: 576px) {
        font-size: 2.3rem;
    }
    @media (min-width: 992px) {
        font-size: 4.3rem;
    }
    @media (min-width: 1200px) {
        font-size: 4.45rem;
    }
`;

const ColumnText = styled.span`
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    font-size: 1rem;
    font-family: "Hack";
    font-weight: bold;
    color: white;
    flex: .6;
    
    @media (min-width: 576px) {
        font-size: 1.25rem;
    }
    @media (min-width: 992px) {
        font-size: 1.5rem;
    }
    @media (min-width: 1200px) {
        font-size: 1.6rem;
    }
`;



const ColumnTextSmall = styled.span`
    display: flex;
    align-content: center;
    font-size: 1rem;
    font-family: "Hack";
    font-weight: bold;
    color: white;
    opacity: ${({opacity}) => opacity ?? "0.4"};
    
    @media (min-width: 576px) {
        font-size: 1rem;
    }
    @media (min-width: 992px) {
        font-size: 1.25rem;
    }
    @media (min-width: 1200px) {
        font-size: 1.5rem;
    }
`;

const ColumnTextSmallMail = styled(ColumnTextSmall)`
  font-weight: bold;
`;

const ColumnLinkText = styled.a`
    font-size: 1rem;
    font-family: "Hack";
    font-weight: bold;
    color: white;
    
    &:hover {
      text-decoration: underline;
      color: ${({hoverColor}) => hoverColor ?? "blue"}; 
    }
    
    
    @media (min-width: 576px) {
        font-size: 1rem;
    }
    @media (min-width: 992px) {
        font-size: 1.25rem;
    }
    @media (min-width: 1200px) {
        font-size: 1.5rem;
    }
`;


const LineContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  width: 100%;
  margin: .5rem 0;
`;

const LinesContainer = styled.div`
  align-self: center;
  position: relative;
  width: 100%;
  margin-bottom: .5rem;
`;

const TextFlexContainer = styled.div`
  display: flex;
  flex-direction: ${({direction}) => direction ?? "row"};
  width: 100%;
`;


const Title = styled.div`
  font: bolder 9.5vw "Hack";
  color: white;
  z-index:1;
  
  @media (min-width: 576px) { font-size: 9.5vw; }
  @media (min-width: 992px) { font-size: 7.5vw; }
  @media (min-width: 1200px) { font-size: 7vw; }
`;

const LineBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background-color: #514571;
  border-radius: 2px;
  z-index: 2;
  width: 100%;
  align-self: center;
  flex: 1;
`;

const LineForeground = styled(LineBackground)`
  position: relative;
  width: ${({width}) => width ?? "100%"};
  z-index: 3;
  background-color: #E94057;
  opacity: 1;
`;

const TextContainer = styled.div`
  position: absolute;
  padding: 0 .5rem;
  align-self: center;
  @media (min-width: 576px) { padding: 0 1rem; }
  @media (min-width: 992px) { padding: 0 2rem; }
  @media (min-width: 1200px) { padding: 0 2.5rem; }
`;

const LineAndTextContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-content: center;
    margin: .5rem 1rem;
    flex-direction: column;
`;

const LineTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
`;

const Subtitle = styled(Title)`
  font: bold 4vw "Hack";
  mix-blend-mode: soft-light; 
  text-transform: uppercase;
  text-shadow: none; 
  
  @media (min-width: 576px) { font-size: 4.5vw; }
  @media (min-width: 992px) { font-size: 3.25vw; }
  @media (min-width: 1200px) { font-size: 2.75vw; }
`;

const MyStuff = styled.div`
  padding: 1rem .5rem;
  
  @media (min-width: 576px) { padding: 1rem 1rem; }
  @media (min-width: 992px) { padding: 1rem 2rem; }
  @media (min-width: 1200px) { padding: 1rem 2.5rem; }
  @media (min-width: 1200px) { padding: 1rem 2.5rem; max-width: 1200px; margin: auto; }
`;

const ExperienceContainer = styled.div`
  display: flex;
`;

const ExperienceLine = styled.div`
  position: relative;
`;

const ExperienceLineContainer = styled.div`
  border-left: ${({lineWidth}) => `${lineWidth}px` ?? "5px"} solid rgba(216,27,96, 0.40);
  width: ${({lineWidth}) => `${lineWidth}px` ?? "5px"};
  height: 100%;
`;

const ExperienceTextContainer = styled.div`
  padding: .5rem;
  
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
  margin: 2rem 0 0 0;
  
  border-top: 3px solid #514571;
  
  @media (min-width: 576px) { padding: 1rem 1rem; margin: 2rem 0 0 0; }
  @media (min-width: 992px) { padding: 2rem 1rem; margin: 2rem 0 0 0; }
  @media (min-width: 1200px) { padding:  2.5rem 1rem; margin: 4rem 0 0 0  }
`;


const Dot = styled.svg`
  position: absolute;
  top: ${({lineWidth}) => `${lineWidth / 2}px`};
  left: ${({lineWidth}) => `-${lineWidth / 2}px`};
`;

function App() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "index.js";
        document.body.appendChild(script);
    });

    const links = [
        ["https://drive.google.com/file/d/1HVq7RilavxQPcDgmYR_3yRpLljLH3FZF/view?usp=sharing", "Résumé"],
        ["https://github.com/Thomas-X", "Github"],
        ["https://gitlab.com/Thomas-X", "Gitlab"],
        ["https://www.linkedin.com/in/thomas-zwarts-170753158", "Linkedin"],
    ];

    const projects = [
        ["https://github.com/Thomas-X/sendai", "Sendai"],
        ["https://github.com/Thomas-X/channelbot-3", "Channelbot 3"],
        ["https://github.com/Thomas-X/csharp-cellular-automaton", "Cellular Automaton"],
        ["https://github.com/Thomas-X/Qui", "Qui"],
        ["https://github.com/Thomas-X/sandwhich-maker", "Sandwich maker (gRPC & Go)"],
        ["https://github.com/Thomas-X/channelbot-2", "Channelbot 2 (deprecated)"],
    ];

    const workedForCompanies = [
        ["https://www.elements.nl/", "Elements"],
        ["https://www.albelli.nl/", "Albelli"],
        ["https://www.oberon.nl/", "Oberon"],
    ];

    const experience = (name, skill, leftText, rightText) => ({name, skill, leftText, rightText});
    const experiences = [
        experience("", true, "junior", "medior"),
        experience("React", "75%", "", ""),
        experience("Typescript", "75%", "", ""),
        experience("Terraform with AWS", "60%", "", ""),
        experience("C# 7", "55%", "", ""),
        experience("PHP Laravel", "25%", "", ""),

        experience("", true, "novice", "junior"),
        experience("Rust", "80%", "", ""),
        experience("Go", "35%", "", ""),
        experience("Elm", "15%", "", ""),
        experience("Kotlin", "10%", "", ""),
    ];

    const lineWidth = 12;

    return (
        <div>
            <HeroContainer>
                <TextContainer>
                    <Title>
                        Thomas Zwarts
                    </Title>
                    <Subtitle>
                        developer | frontend | backend
                    </Subtitle>
                </TextContainer>
                <canvas id="game-of-life-canvas">
                </canvas>
            </HeroContainer>
            <MyStuff>
                <Row noGutters={true}>
                    <Col xs={12} sm={12} md={6}>
                        <ColumnTitles>
                            <TextFlexContainer>
                                <ColumnTitles style={{color: "#26a69a"}}>L</ColumnTitles>inks.
                            </TextFlexContainer>
                            <TextFlexContainer direction={"column"}>
                                {
                                    links.map((x, i) => <ColumnLinkText key={i} target="_blank" href={x[0]}
                                                                        hoverColor={"#26a69a"} style={{
                                        marginBottom: i !== links.length - 1 ? 10 : 0
                                    }}>
                                        {x[1]}
                                    </ColumnLinkText>)

                                }
                            </TextFlexContainer>
                        </ColumnTitles>
                    </Col>
                    <Col xs={12} sm={12} md={6}>
                        <ColumnTitles>
                            <TextFlexContainer>
                                <ColumnTitles style={{color: "#0288d1"}}>P</ColumnTitles>rojects.
                            </TextFlexContainer>
                            <TextFlexContainer direction={"column"}>
                                <ColumnTextSmall style={{
                                    marginBottom: 15,
                                }}>
                                    I worked on projects for these companies.
                                </ColumnTextSmall>
                                {
                                    workedForCompanies.map((x, i) => <ColumnLinkText key={i} target="_blank" href={x[0]}
                                                                           hoverColor={"#26a69a"} style={{
                                        marginBottom: i !== workedForCompanies.length - 1 ? 10 : 0
                                    }}>
                                        {x[1]}
                                    </ColumnLinkText>)
                                }
                            </TextFlexContainer>

                            <TextFlexContainer direction={"column"}>
                                <ColumnTextSmall style={{
                                    marginBottom: 15,
                                    marginTop: 30
                                }}>
                                    Hobby projects.
                                </ColumnTextSmall>
                                {
                                    projects.map((x, i) => <ColumnLinkText key={i} target="_blank" href={x[0]}
                                                                        hoverColor={"#26a69a"} style={{
                                        marginBottom: i !== projects.length - 1 ? 10 : 0
                                    }}>
                                        {x[1]}
                                    </ColumnLinkText>)
                                }
                            </TextFlexContainer>
                        </ColumnTitles>
                    </Col>
                </Row>
                <Footer>
                    <ColumnTextSmall style={{flexDirection: "column", textAlign: "center", justifyContent: "center"}}>
                        Made with ❤ by Thomas Zwarts.
                    </ColumnTextSmall>
                    <ColumnTextSmall opacity={1} style={{flexDirection: "column", textAlign: "center", justifyContent: "center"}}>
                        contact me at: thomaszwarts@gmail.com
                    </ColumnTextSmall>
                </Footer>
            </MyStuff>
        </div>
    );
}

export default App;
