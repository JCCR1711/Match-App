import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";

export default function Index() {
    const {user} = useAuth();
    return user
        ? <Redirect href={"/(tabs)"}/>
        : <Redirect href={"/auth/slides"}/>
}