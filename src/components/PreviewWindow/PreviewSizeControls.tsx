import React, { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "src/state/types"
import { setPreviewSize } from "src/state/actions"

import SmartphoneIcon from "@material-ui/icons/Smartphone"
import TabletIcon from "@material-ui/icons/TabletAndroid"
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows"
import {
  BottomNavigation,
  BottomNavigationAction,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sizeControlRoot: {
      height: "auto",
      backgroundColor: theme.palette.background.default,
      position: "absolute",
      bottom: 0,
      left: 0,
      flexDirection: "column",
    },
  })
)

const PreviewSizeControls = () => {
  const classes = useStyles()
  const previewSize = useSelector((state: RootState) => state.previewSize)
  const dispatch = useDispatch()
  const handleOnChange = useCallback(
    (_, value) => dispatch(setPreviewSize(value)),
    [dispatch]
  )
  return (
    <BottomNavigation
      value={previewSize}
      onChange={handleOnChange}
      className={classes.sizeControlRoot}
      showLabels
    >
      <BottomNavigationAction
        label="Phone"
        value="xs"
        icon={<SmartphoneIcon />}
      />
      <BottomNavigationAction label="Tablet" value="sm" icon={<TabletIcon />} />
      <BottomNavigationAction
        label="Desktop"
        value={false}
        icon={<DesktopWindowsIcon />}
      />
    </BottomNavigation>
  )
}

export default PreviewSizeControls