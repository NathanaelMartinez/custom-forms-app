import React from "react";
import { AggregatedData } from "../../types"; // Assuming this is where the types are defined

interface AggregatedDataTablesProps {
  aggregatedData: AggregatedData;
}

const AggregatedDataTables: React.FC<AggregatedDataTablesProps> = ({
  aggregatedData,
}) => {
  // utility func to round after 2 decimals
  const formatNumber = (num?: number, decimals: number = 2) => {
    return num !== undefined ? num.toFixed(decimals) : "N/A";
  };

  // Safely handle if data is not in expected format
  const hasData = (data?: object) => {
    return data && Object.keys(data).length > 0;
  };

  return (
    <div className="text-start">
      <h2 className="text-dark mt-5">{aggregatedData.responseCount} Responses</h2>

      {/* Check if numeric data exists */}
      {hasData(aggregatedData.numericData) && (
        <div className="table-responsive">
          <h3 className="text-dark mt-5">Numeric Data</h3>
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>Question</th>
                <th>Average</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(aggregatedData.numericData).map((questionId) => (
                <tr key={questionId}>
                  <td>{aggregatedData.numericData[questionId].questionText}</td>
                  <td>{formatNumber(aggregatedData.numericData[questionId].average)}</td>
                  <td>{formatNumber(aggregatedData.numericData[questionId].min)}</td>
                  <td>{formatNumber(aggregatedData.numericData[questionId].max)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Check if text data exists */}
      {hasData(aggregatedData.textData) && (
        <div className="table-responsive">
          <h3 className="text-dark mt-5">Text Responses</h3>
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>Question</th>
                <th>Text Counts</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(aggregatedData.textData).map((questionId) => (
                <tr key={questionId}>
                  <td>{aggregatedData.textData[questionId].questionText}</td>
                  <td>
                    {Object.entries(aggregatedData.textData[questionId].counts || {}).map(
                      ([answer, count]) => (
                        <p key={answer}>
                          <strong>{answer}:</strong> {count}
                        </p>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Check if checkbox data exists */}
      {hasData(aggregatedData.checkboxData) && (
        <div className="table-responsive">
          <h3 className="text-dark mt-5">Checkbox Option Counts</h3>
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>Question</th>
                <th>Option Counts</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(aggregatedData.checkboxData).map((questionId) => (
                <tr key={questionId}>
                  <td>{aggregatedData.checkboxData[questionId].questionText}</td>
                  <td>
                    {Object.entries(
                      aggregatedData.checkboxData[questionId].optionCounts || {}
                    ).map(([option, count]) => (
                      <p key={option}>
                        <strong>{option}:</strong> {count}
                      </p>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AggregatedDataTables;
