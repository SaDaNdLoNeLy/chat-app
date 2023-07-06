import React, { useEffect } from "react";
import ChatBox from "../../components/chatcomp/ChatBox";
import ChatList from "../../components/chatcomp/ChatList/ChatList";
import SideSearch from "../../components/chatcomp/SideSearch";
import { logout } from "../../components/Auth";
import { connect } from "react-redux";
import { getActions } from "../../store/actions/authAction";
import { ChatState } from "../../StateProvider";
import { useState } from "react";

const ChatPage = () => {
  const [fetch, setFetch] = useState(false)
  const {user, setUser} = ChatState();
  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    if (!userDetails) {
      logout();
    } else {
      setUser(JSON.parse(userDetails));
    }
  }, []);
  
  return (
    <div className="h-screen w-screen bg-primary overflow-hidden">
      {user && <SideSearch />}
      <div className="flex w-screen h-[92%] justify-between p-2">
        {user&&<ChatList fetch={fetch} />}
        {user&&<ChatBox fetch={fetch} setFetch={setFetch}/>}
      </div>
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getActions(dispatch),
  };
};

export default connect(null, mapActionsToProps)(ChatPage);
