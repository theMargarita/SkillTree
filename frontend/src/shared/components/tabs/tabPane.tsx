import type { JSX, ReactElement } from "react";

export type TabPaneProps = {
  title: string;
  children: ReactElement | ReactElement[];
};

const TabPane = ({ children }: TabPaneProps): JSX.Element => (
  <div>{children}</div>
);

export default TabPane;
