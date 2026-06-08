"user client";

import { useUser } from "@clerk/nextjs";

export const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();

  return (
    <div>
      <h2>
        Welcome Back{ isLoaded ? ", " : " " }{user?.firstName}👋
      </h2>

      <p>
        This is your Financial Overview Board.
      </p>
    </div>
  )
}