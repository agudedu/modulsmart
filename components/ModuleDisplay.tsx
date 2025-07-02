
import React from 'react';

interface ModuleDisplayProps {
  content: string;
}

// Helper to parse simple inline markdown like bold text (**...**).
const parseInlineMarkdown = (text: string) => {
    // Using regex for safer splitting of multiple occurrences.
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
        // Parts with odd indices are the captured bold text.
        return index % 2 === 1 ? <strong key={index} className="font-semibold text-gray-800">{part}</strong> : part;
    });
};

export const ModuleDisplay: React.FC<ModuleDisplayProps> = ({ content }) => {
  const renderContent = () => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 mb-3 text-justify">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    const isTableLine = (line: string): boolean => {
        const trimmed = line.trim();
        return trimmed.startsWith('|') && trimmed.endsWith('|');
    };

    const isTableSeparator = (line: string): boolean => {
        const trimmed = line.trim();
        if (!isTableLine(trimmed)) return false;
        // Check content between pipes e.g. |---|:---|--:|
        const parts = trimmed.split('|').slice(1, -1);
        // Ensure there are parts and every part is a valid separator part
        return parts.length > 0 && parts.every(part => /^\s*:?-+:?\s*$/.test(part));
    };

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const trimmedLine = line.trim();
        const nextLine = lines[i + 1]?.trim();

        // Table Detection Logic
        if (isTableLine(trimmedLine) && nextLine && isTableSeparator(nextLine)) {
            flushList();

            const tableLines: string[] = [];
            // Header
            tableLines.push(trimmedLine);
            i++;
            // Separator (we consume it but don't use it for rendering)
            i++;
            // Body rows
            while (i < lines.length && isTableLine(lines[i].trim())) {
                tableLines.push(lines[i].trim());
                i++;
            }

            const headerLine = tableLines[0];
            const headerCells = headerLine.split('|').slice(1, -1).map(c => c.trim());

            const bodyLines = tableLines.slice(1);

            elements.push(
                <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {headerCells.map((cell, index) => (
                                    <th key={index} scope="col" className="px-4 py-3 font-semibold text-gray-700">
                                        {parseInlineMarkdown(cell)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {bodyLines.map((bodyLine, rowIndex) => {
                                const rowCells = bodyLine.split('|').slice(1, -1).map(c => c.trim());
                                // Ensure the number of cells matches the header to avoid rendering issues
                                if (rowCells.length !== headerCells.length) return null;

                                return (
                                    <tr key={rowIndex} className="border-t border-gray-100 hover:bg-gray-50">
                                        {rowCells.map((cell, cellIndex) => (
                                            <td key={cellIndex} className="px-4 py-3 text-gray-600 align-top">
                                                {parseInlineMarkdown(cell)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );

            continue; // Continue to the next while-loop iteration
        }
        
        // --- Existing Logic for other elements ---
        if (trimmedLine.startsWith('- ')) {
            const listItemContent = trimmedLine.substring(2);
            listItems.push(<li key={i} className="mb-1">{parseInlineMarkdown(listItemContent)}</li>);
        } else {
            flushList();

            if (trimmedLine.startsWith('### ')) {
              elements.push(<h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-gray-700">{parseInlineMarkdown(trimmedLine.substring(4))}</h3>);
            } else if (trimmedLine.startsWith('## ')) {
              elements.push(<h2 key={i} className="text-xl font-bold mt-6 mb-3 pb-2 border-b-2 border-indigo-100 text-gray-800">{parseInlineMarkdown(trimmedLine.substring(3))}</h2>);
            } else if (trimmedLine.startsWith('# ')) {
              elements.push(<h1 key={i} className="text-2xl font-extrabold mt-2 mb-4 text-center text-indigo-700">{parseInlineMarkdown(trimmedLine.substring(2))}</h1>);
            } else if (trimmedLine === '---') {
              elements.push(<hr key={i} className="my-6 border-gray-200" />);
            } else if (trimmedLine !== '') {
              elements.push(<p key={i} className="mb-3 text-justify">{parseInlineMarkdown(trimmedLine)}</p>);
            }
        }
        i++;
    }

    flushList(); // Flush any remaining list items at the end of the content.

    return elements;
  };

  return (
    <div className="max-w-none prose prose-indigo">
      {renderContent()}
    </div>
  );
};
