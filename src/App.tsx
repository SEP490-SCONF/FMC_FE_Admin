import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import UserManagement from "./pages/Tables/UserManagement";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ConferenceTables from "./pages/Conference/ConferenceList";
import AddConference from "./pages/Conference/AddNewConference";
import TopicAdmin from "./pages/Topic/TopicListAdmin";
import MoneyTables from "./pages/PaymentList/PaymentInfo";
// import FormElements from "./pages/Forms/FormElements";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/home" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Conference */}
            {/* <Route path="/form-elements" element={<FormElements />} /> */}
            <Route path="/conference" element={<ConferenceTables />} />
            <Route path="/conference/add" element={<AddConference />} />

            {/*Topic*/}
            <Route path="/topic" element={<TopicAdmin />} />

            {/* Form Elements */}
            {/* <Route path="/form-elements" element={<FormElements />} /> */}


            {/* User Tables */}
            {/* <Route path="/basic-tables" element={<BasicTables />} /> */}
            <Route path="/user-management" element={<UserManagement />} />

            {/* Money Tables */}
            <Route path="/money-tables" element={<MoneyTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
