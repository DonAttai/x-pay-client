import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  return (
    <div className="h-screen flex flex-col items-center justify-center  space-y-4">
      <p className="text-blue-400 text-4xl">X-PAY</p>
      {reference ? <p>Reference: {reference}</p> : null}
      <p>Congratulations! You have successfully fund your wallet.</p>
      <Link to="/dashboard/wallet">
        <Button variant="secondary">Back To Wallet</Button>
      </Link>
    </div>
  );
};
