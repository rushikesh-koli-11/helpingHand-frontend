import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = "771606424506-uot1pg5uefabs1q9uv2o1n39c9pc6dfj.apps.googleusercontent.com"; 

function GoogleSignIn() {
  const [steps, setSteps] = useState(0);

  const fetchFitnessData = async (accessToken) => {
    console.log("Access Token:", accessToken);
    try {
      const response = await fetch(
        "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`, 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
            bucketByTime: { durationMillis: 86400000 }, // Get daily steps
            startTimeMillis: Date.now() - 7 * 86400000, // Last 7 days
            endTimeMillis: Date.now(),
          }),
        }
      );

      const data = await response.json();
      console.log("Step Data:", data);

      const totalSteps = data.bucket.reduce((total, bucket) => {
        const stepCount = bucket.dataset[0]?.point[0]?.value[0]?.intVal || 0;
        return total + stepCount;
      }, 0);

      setSteps(totalSteps); // Update UI with step count
    } catch (error) {
      console.error("Error fetching fitness data:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>Step Tracker</h2>

        {/* ✅ Corrected Google Login Button */}
        <GoogleLogin
          onSuccess={(response) => {
            console.log("Login Success:", response);
            fetchFitnessData(response.access_token); // ✅ Correct way to get access token
          }}
          onError={() => console.log("Login Failed")}
          useOneTap
          scope="https://www.googleapis.com/auth/fitness.activity.read"
        />

        {/* Display Steps */}
        <h3 style={{ color: "white" }}>Today's Steps: {steps}</h3>
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleSignIn;
