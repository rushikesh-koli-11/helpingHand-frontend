import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const DownloadReceipt = async (donationId) => {
    try {
      const response = await fetch(API_ENDPOINTS.DOWNLOAD_RECEIPT_BY_DONATIONID(donationId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob(); // Convert response to a Blob
        const url = window.URL.createObjectURL(blob); // Creating a URL for the Blob
        const link = document.createElement("a"); // Creating a temporary <a> element
        link.href = url;
        link.download = "receipt.pdf"; // Set the file name for download
        link.click(); // Trigger the download
        window.URL.revokeObjectURL(url); // Clean up the URL object
      } else {
        console.error("Failed to download receipt:", response.statusText);
      }
    } catch (error) {
      console.error("Error while downloading the receipt:", error);
    }
  
};

export default DownloadReceipt;
