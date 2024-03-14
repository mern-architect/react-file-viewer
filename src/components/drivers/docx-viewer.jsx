// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component } from 'react';
import mammoth from 'mammoth';
import Highlighter from "react-highlight-words";

import 'styles/docx.scss';
import Loading from '../loading';

export default class extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: ""
    }
  }
  componentDidMount() {
    const jsonFile = new XMLHttpRequest();
    jsonFile.open('GET', this.props.filePath, true);
    jsonFile.send();
    jsonFile.responseType = 'arraybuffer';
    jsonFile.onreadystatechange = () => {
      if (jsonFile.readyState === 4 && jsonFile.status === 200) {
        mammoth.convertToHtml(
          { arrayBuffer: jsonFile.response },
          { includeDefaultStyleMap: true },
        )
        .then((result) => {
          console.log("RESULET", result)
          // this.setState({value: result.value})
          const docEl = document.createElement('div');
          docEl.className = 'document-container';
          docEl.innerHTML = result.value.replace("A modeling file with restricted information, mainly used for viewing", '<span id="12345" style="color: red;">A modeling file with restricted information, mainly used for viewing</span>');
          document.getElementById('docx').innerHTML = docEl.outerHTML;
        })
        .catch((a) => {
          console.log('alexei: something went wrong', a);
        })
        .done();
      }
    };
  }

  

  render() {
    // if(!this.state.value) return <p>Loadin...</p>
    return (
      <div id="docx">
        {/* <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={["From"]}
          autoEscape={true}
          textToHighlight={this.state.value}
        /> */}
      </div>);
  }
}
