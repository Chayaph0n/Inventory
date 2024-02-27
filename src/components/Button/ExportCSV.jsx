// ExportCSV.js
import './ExportCSV.css'
import { useState } from 'react';
import DashboardColumns from '../DataColumn/DashboardColumns';

const ExportCSV = ({ data, startDate, endDate, search, searchRing, searchSupLot, 
                    finishInspection, usageAll, remainAll, remainGood, remainReject }) => {

    // Prevent repeat download 
    const [isExporting, setIsExporting] = useState(false);

    // Function to escape and enclose data in double quotes if needed
    const escapeAndEnclose = (value) => {
        if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`; // Escape double quotes by doubling them
        }
        return value;
    };

    // Define the missing getInnerTextFromJSX function
    const getInnerTextFromJSX = (jsx) => {
        if (typeof jsx === 'string') {
            return jsx;
        }
        if (Array.isArray(jsx)) {
            return jsx.map(getInnerTextFromJSX).join('');
        }
        if (typeof jsx === 'object' && jsx.props && jsx.props.children) {
            return getInnerTextFromJSX(jsx.props.children);
        }
        return '';
    };

    const handleExportCSV = () => {

        if (isExporting) {
            return;
        }

        const csvContent = [
            ['Start Date', startDate],
            ['End Date', endDate],
            ['COSA Code', search],
            ['Output Ring', searchRing],
            ['Supplier Lot', searchSupLot],
            [],
            ['Finish Inspection', finishInspection],
            ['Usage All', usageAll],
            ['Remain All', remainAll],
            ['Remain Good', remainGood],
            ['Remain Reject', remainReject],
            [], // Empty row for spacing
            [], // Empty row for spacing
        ];

        // Header row
        const headerRow = DashboardColumns
            // .filter(column => column.name !== 'Action')
            .map(column => {
                if (typeof column.name === 'string') {
                    return escapeAndEnclose(column.name);
                } else if (typeof column.name === 'object' && column.name.type === 'div') {
                    return escapeAndEnclose(getInnerTextFromJSX(column.name));
                } else {
                    return '';
                }
            });
        csvContent.push(headerRow); // Add the header row to csvContent

        // Data rows
        data.forEach(item => {
            const rowData = DashboardColumns.map(column => {
                if (typeof column.selector === 'function') {
                    return escapeAndEnclose(column.selector(item));
                } else if (typeof column.selector === 'string') {
                    const value = item[column.selector];
                    if (value !== undefined && value !== null) {
                        return escapeAndEnclose(value.toString());
                    } else {
                        return '';
                    }
                } else {
                    return '';
                }
            });

            csvContent.push(rowData);
        });

        const csvRows = csvContent.map(row => row.join(',')); // Join data into CSV rows
        const csvText = csvRows.join('\n'); // Join rows with newlines

        const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'COSA_data.csv';
        link.click();

        setIsExporting(false);
    };

    return (
        <div className='export-button' onClick={handleExportCSV}>
            <span className="material-symbols-outlined">ios_share</span>
            <label>Export</label>
        </div>
    );
}

export default ExportCSV;
