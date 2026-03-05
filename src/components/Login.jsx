import { Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { loginWithGoogle } = useAuth();
  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <h1 className="text-3xl font-bold">로그인</h1>
      <div className="flex flex-col gap-2">
        <Button onClick={loginWithGoogle} size="lg" variant="bordered" startContent={<FcGoogle />}>
          Google로 로그인
        </Button>
      </div>
    </div>
  );
};

export default Login;
