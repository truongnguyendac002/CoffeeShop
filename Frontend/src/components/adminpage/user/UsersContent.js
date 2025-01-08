import { useEffect, useState } from "react";
import fetchWithAuth from "../../../helps/fetchWithAuth";
import summaryApi from "../../../common";
import UserTable from "./UserTable";

const UsersContent = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await fetchWithAuth(summaryApi.getAllUsers.url, {
                    method: summaryApi.getAllUsers.method,
                });
                const dataResponse = await response.json();
                if (dataResponse.respCode === "000") {
                    setUserList(dataResponse.data);
                } else {
                    console.log("Lấy dữ liệu không thành công", dataResponse);
                }
            } catch (error) {
                console.log("Lỗi khi gọi API:", error);
            }
        };

        fetchAllUsers();
    }, []);
    return (
        <>
            <UserTable userList={userList} setUserList={setUserList} />
        </>
    )

};

export default UsersContent;
