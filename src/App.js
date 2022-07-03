import React, { Component } from "react";
import styled, { createGlobalStyle } from "styled-components";
import _ from "lodash";

const GlobalStyle = createGlobalStyle`
html,
body, #root {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const Header = styled.div``;

const Title = styled.h2`
  text-align: center;
`;

const ChangeButton = styled.button``;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  padding-top: 10px;
`;

const Editor = styled.textarea`
  display: flex;
  width: 50%;
  flex: 1;
`;

const Seperator = styled.div`
  width: 30px;
  height: 100%;
  text-align: center;
`;

const View = styled.pre`
  display: flex;
  width: 50%;
  flex: 1;
  padding: 0px;
  margin: 0px;
  background-color: #f1f1f1;
`;

const jsonToEnv = (jsonStr, prevJsonText) => {
  try {
    const jsonObject = JSON.parse(jsonStr);
    return _.reduce(
      _.keys(jsonObject),
      (res, key) => {
        return res + `\n${key}=${jsonObject[key]}`;
      },
      ""
    );
  } catch (e) {
    return prevJsonText;
  }
};

const envToJson = (envStr) => {
  const env = {};
  envStr.replace(/(\w+)=(.+)/g, function ($0, $1, $2) {
    env[$1] = $2;
  });
  return JSON.stringify(env, undefined, 2);
};

class App extends Component {
  state = {
    isJsonToEnv: true,
    editorText: "",
    viewText: "",
  };

  componentDidMount() {
    const mockJSON = {
      TEST: 1,
    };
    const mockJSONStr = JSON.stringify(mockJSON, undefined, 2);
    this.setState({
      editorText: mockJSONStr,
      viewText: jsonToEnv(mockJSONStr, ""),
    });
  }

  render() {
    const { isJsonToEnv, editorText, viewText } = this.state;
    return (
      <Container>
        <GlobalStyle />
        <Header>
          <Title>{isJsonToEnv ? `JSON TO DOTENV` : `DOTENV TO JSON`}</Title>
          <ChangeButton onClick={this.toggle}>
            {!isJsonToEnv ? `JSON TO DOTENV` : `DOTENV TO JSON`}
          </ChangeButton>
        </Header>
        <Content>
          <Editor onChange={this.changeEditor} value={editorText} />
          <Seperator>{"=>"}</Seperator>
          <View>{viewText}</View>
        </Content>
      </Container>
    );
  }

  changeEditor = (e) => {
    const value = e.target.value;
    const { isJsonToEnv, viewText } = this.state;

    this.setState({
      editorText: value,
      viewText: isJsonToEnv ? jsonToEnv(value, viewText) : envToJson(value),
    });
  };

  toggle = () => {
    this.setState((prevState) => {
      return {
        editorText: prevState.viewText,
        viewText: prevState.editorText,
        isJsonToEnv: !prevState.isJsonToEnv,
      };
    });
  };
}

export default App;
