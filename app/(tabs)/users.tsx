import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

interface UserCardProps {
  name: string;
  email: string;
}

const UserCard = ({ name, email }: UserCardProps) => {
  return (
    <TouchableOpacity style={styles.userCardContainer}>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.userCardTitle}>{name}</Text>
        <Text style={styles.userCardSubTitle}>{email}</Text>
      </View>
    </TouchableOpacity>
  );
};

const UsersPage = () => {
  const getData = async () => {
    const collectionRef = collection(db, "users");

    await onSnapshot(collectionRef, async (data) => {
      setUsers(
        await data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
      setIsLoading(false);
    });

    // await getDocs(collectionRef).then((response) => {
    //   setUsers(
    //     response.docs.map((data) => {
    //       return { ...data.data(), id: data.id };
    //     })
    //   );
    // });
  };

  useEffect(() => {
    getData();
  }, []);

  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 15 }}>All</Text>
      {/* {isLoading ? (
        <Text>Loading users...</Text>
      ) : (
        <ScrollView>
          {users.map((user: any, key: number) => {
            return <UserCard key={key} name={user?.id} email={user?.email} />;
          })}
        </ScrollView>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  userCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    // backgroundColor: "cyan",
  },
  userCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userCardSubTitle: {
    fontSize: 14,
    color: "gray",
  },
});

export default UsersPage;
