// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import CSV from 'comma-separated-values';

class CsvViewer extends Component {
  static parse(data) {
    const rows = [];
    const columns = [];

    new CSV(data).forEach((array) => {
      if (columns.length < 1) {
        array.forEach((cell, idx) => {
          columns.push({
            key: `key-${idx}`,
            id: idx,
            name: cell,
            resizable: true,
            sortable: true,
            filterable: true,
          });
        });
      } else {
        const row = {};
        array.forEach((cell, idx) => {
          row[`key-${idx}`] = cell;
        });
        rows.push(row);
      }
    });

    return { rows, columns };
  }

  // Helper function to apply highlights to a text
  applyHighlights = (text, highlights) => {
    let highlightedText = text;
    highlights.forEach((highlight) => {
      const highlightRegex = new RegExp(highlight.text, 'gi');
      highlightedText = highlightedText.replace(highlightRegex, (match) => {
        return `<span id="${highlight.id}" style="background-color: ${highlight.color}">${match}</span>`;
      });
    });
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  constructor(props) {
    super(props);
    this.state = CsvViewer.parse(props.data);
    this.state.highlights = props.highlights || [{
      text: "Installation of red stamped pavers as approved per drawing",
      id: "123",
      type: 'new-task',
      color: "green"
    }, {
      text: "Demo and Excavation of originally installed walkway pavers",
      id: "1234",
      type: "already-completed",
      color: 'red'
    }];
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...CsvViewer.parse(nextProps.data), highlights: nextProps.highlights || [] });
  }

  // Modified rowGetter function to include sentence highlighting
  rowGetter = (i) => {
    const { rows, highlights } = this.state;
    const row = rows[i];
  
    // Check if the row is undefined or null
    if (!row) {
      return {};
    }
  
    // Add sentence highlights to each cell in the row
    const highlightedRow = {};
    Object.keys(row).forEach((key) => {
      const cell = row[key];
      
      // Check if the cell is undefined or null
      const cellContent = cell != null ? cell : '';
      
      const highlightedCell = this.applyHighlights(cellContent, highlights);
      highlightedRow[key] = highlightedCell;
    });
  
    return highlightedRow;
  };
  

  render() {
    const { rows, columns, highlights } = this.state;

    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: '1', overflowY: 'auto', paddingRight: '10px' }}>
          <ReactDataGrid
            columns={columns}
            rowsCount={rows.length}
            rowGetter={this.rowGetter}
            minHeight={this.props.height || 650}
            onGridSort={this.props.onGridSort}
          />
        </div>
        <div style={{ width: '300px', padding: '10px', borderLeft: '1px solid #ccc' }}>
          <div>
            <h3>Highlights</h3>
            {highlights.map((highlight, index) => (
              <p
                style={{ borderBottom: '2px solid #ccc', padding: '10px' }}
                key={index}
              >
               <a href={`#${highlight.id}`}>{highlight.text}</a> 
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default CsvViewer;