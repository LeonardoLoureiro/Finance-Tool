import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <p>
      This is an authenticated route. You can only see this if you are signed in. If you are not signed in, you will be redirected to the sign-in page.
    </p>
  );
}
