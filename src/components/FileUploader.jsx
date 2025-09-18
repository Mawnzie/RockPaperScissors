// import { useState } from "react";

// export default function FileUploader() {
//   const [files, setFiles] = useState([]);

//   const handleFileChange = (e) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files); // convert FileList → array
//       setFiles(selectedFiles);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         multiple
//         accept=".json,.bin"
//         onChange={handleFileChange}
//       />
//       {files.length > 0 && (
//         <div>
//           <p>Selected files:</p>
//           <ul>
//             {files.map((file, idx) => (
//               <li key={idx}>
//                 {file.name} ({file.type})
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

export default function FileUploader({ onFilesSelected }) {
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      if (onFilesSelected) onFilesSelected(selectedFiles);
    }
  };

  return (
    <input
      type="file"
      multiple
      accept=".json,.bin"
      onChange={handleFileChange}
    />
  );
}
