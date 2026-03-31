import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

import Register from "./RegisterPage/register";
import LoginPage from "./LoginPage/loginPage";
import OtpVerification from "./OTPCode/otpCode";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpVerification />} />
      </Routes>


      <Toaster />
    </BrowserRouter>
  );
}

export default App;