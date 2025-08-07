import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button,
  Tabs as TabsUi,
  Tab as TabUi
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import TabPanel from "../BoxOptionsLite/TabPanel";

export class Tab {
  title: string
  content: any

  constructor(title, content) {
    this.title = title
    this.content = content
  }
}

export const Position = {
  TOP: 1,
  BOTTOM: 2
}

export const Align = {
  LEFT: 1,
  CENTER: 2,
  RIGHT: 3
}

const Tabs = ({
  tabsItems,
  position = Position.TOP,
  align = Align.CENTER
}) => {


  const [tabNumber, setTabNumber] = useState(0)
  const [info, setInfo] = useState('')
  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  const [titles, setTitles] = useState([])
  const [contents, setContents] = useState([])

  useEffect(() => {
    var titleArr: any = []
    var contentArr: any = []

    tabsItems.forEach((tabItem) => {
      titleArr.push(tabItem.title)
      contentArr.push(tabItem.content)
    })

    setTitles(titleArr)
    setContents(contentArr)
  }, [tabsItems])

  return (<>
    {position == Position.TOP && (
      <TabsUi value={tabNumber} onChange={handleChange} sx={{
      }}
        indicatorColor="primary"
        textColor="primary"
        variant={"scrollable"}
        scrollButtons={true}>
        {titles.map((title, key) => (
          <TabUi label={title} key={key} />
        ))}
      </TabsUi>
    )}

    {contents.map((content, key) => (
      <TabPanel value={tabNumber} index={key} key={key}>
        {content}
      </TabPanel>
    ))}

    {position == Position.BOTTOM && (
      <TabsUi value={tabNumber} onChange={handleChange} centered>
        {titles.map((title, key) => (
          <TabUi label={title} key={key} />
        ))}
      </TabsUi>
    )}

  </>)
};

export default Tabs;
