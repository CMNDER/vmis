import React, { useState } from 'react';
import './App.css';
import Sidebar from './Components/Sidebar';
import Stock from './Pages/Stock';
import Vaccines from './Pages/Vaccines';
import Users from './Pages/Users';
import Distribute from './Pages/Distribute';
import Request from './Pages/Request';
import Wastage from './Pages/Wastage';
import NotFound from './Pages/NotFound';
import Acknowledge from './Pages/Acknowledge';
import Dispensed from './Pages/Dispensed';
import Return from './Pages/Return'
import PrivateRoute from './Data/PrivateRoute';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Redistribute from './Pages/Redistribute';
import ChartTry from './Components/ChartTry'
export const userIntelContext = React.createContext()
function App() {
  const [stockId, setStockId] = useState("")
  const infoFromToken = () => {
    var base64Url = localStorage.getItem('vmisJwt').split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return jsonPayload;
  }

  const userInfo = infoFromToken();
  const loggedInUserInfo = JSON.parse(userInfo);
  return (
    <div className="App">
      <userIntelContext.Provider value={loggedInUserInfo}>
        <Router>
          <div className="h-100 row" style={{ margin: "0px" }}>
            {window.location.pathname === "/login" ? <div className="col-lg-2 Sidebar">
            </div> :
              <div className="col-lg-2 Sidebar">
                <Sidebar onChange={value => setStockId(value)} />
              </div>
            }
            <div className="col-lg-10 overflow-auto h-100">
              <Switch>
                <PrivateRoute exact path='/'><Stock stockId={stockId} /></PrivateRoute>
                {loggedInUserInfo.userToken.orgunitlevel === "1" ? <PrivateRoute path='/vaccine' component={Vaccines} /> : ""}
                <PrivateRoute path='/distribute' component={Distribute} />
                {loggedInUserInfo.userToken.orgunitlevel === "1" ? <PrivateRoute path='/users' component={Users} /> : ""}
                <PrivateRoute path='/acknowledge' component={Acknowledge} />
                {loggedInUserInfo.userToken.orgunitlevel === "6"? < PrivateRoute path='/dispensed' component={Dispensed} />:""}
                {loggedInUserInfo.userToken.orgunitlevel !== "1"? <PrivateRoute path='/request' component={Request} />:""}
                <PrivateRoute path='/return' component={Return} />
                <PrivateRoute path='/wastage' component={Wastage} />
                <PrivateRoute path='/redistribute' component={Redistribute} />
                <PrivateRoute path='*' component={NotFound} />
              </Switch>
            </div>
          </div>
        </Router>
      </userIntelContext.Provider>
    </div>
  );
}
export default App;