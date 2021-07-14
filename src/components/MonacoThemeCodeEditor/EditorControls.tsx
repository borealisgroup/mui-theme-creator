import React, { useState } from "react"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import DownloadIcon from "@material-ui/icons/GetApp"
import SaveIcon from "@material-ui/icons/Save"
import RedoIcon from "@material-ui/icons/Redo"
import UndoIcon from "@material-ui/icons/Undo"
import PublishIcon from '@material-ui/icons/Publish';
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import {
  IconButton,
  makeStyles,
  createStyles,
  Theme,
  Divider,
  Snackbar,
} from "@material-ui/core"
import { useSelector } from "react-redux"
import { RootState } from "src/state/types"
import { useCanSave } from "src/state/selectors"
import Alert from "@material-ui/lab/Alert"
import EditorButton from "./EditorSettings"
import { themeUrl, defaultThemeId, defaultHeaders } from 'src/utils';

const uploadThemeOptions = async (themeOptions) => {
  await fetch(themeUrl, {
    method: 'PUT',
    headers: {
      ...defaultHeaders
    },
    body: JSON.stringify(themeOptions)
  })
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editorControlRoot: {
      paddingRight: theme.spacing(),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    editorControlActions: {
      display: "flex",
    },
  })
)

function EditorControls({ onRedo, onUndo, onSave }) {
  const classes = useStyles()
  const canUndo = useSelector((state: RootState) => state.editor.canUndo)
  const canRedo = useSelector((state: RootState) => state.editor.canRedo)
  const canSave = useCanSave();

  const themeOptions = useSelector((state: RootState) => state.themeOptions)

  const [uploadedTheme, setUploadedTheme] = useState(themeOptions);
  const canUpload = JSON.stringify(themeOptions) !== JSON.stringify(uploadedTheme);
  const [succesfullyUploaded, setSuccesfullyUploaded] = useState(false)
  return (
    <div className={classes.editorControlRoot}>
      <div className={classes.editorControlActions}>
        <EditorButton />
        <CopyButton />
        <Divider orientation="vertical" flexItem />
        <Tooltip title="Undo (Ctrl + Z)">
          <span>
            <IconButton disabled={!canUndo} onClick={onUndo}>
              <UndoIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Redo (Ctrl + Y)">
          <span>
            <IconButton disabled={!canRedo} onClick={onRedo}>
              <RedoIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Apply Changes (Ctrl + S)">
          <span>
            <IconButton disabled={!canSave} onClick={onSave}>
              <SaveIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Publish Changes">
          <span>
            <IconButton disabled={!canUpload} onClick={async () => {
              await uploadThemeOptions(themeOptions)
              setUploadedTheme(themeOptions);
              setSuccesfullyUploaded(true)
            }}>
              <PublishIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Snackbar
          open={succesfullyUploaded}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setSuccesfullyUploaded(false)}
        >
          <Alert variant="filled" severity="success">
            Sucessfully uploaded theme, trigger <a href="https://bitbucket.org/borealisdigitalstudio/poc-material-ui-theme/addon/pipelines/home">Bitbucket pipeline</a> to update npm library
          </Alert>
        </Snackbar>
      </div>
      {/* <Typography
        variant="body2"
        color={canSave ? "textPrimary" : "textSecondary"}
        display="inline"
      >
        {canSave ? "* Unsaved Changes" : "All changes saved"}
      </Typography> */}
    </div>
  )
}

export default EditorControls

const CopyButton = ({}) => {
  const themeInput = useSelector((state: RootState) => state.editor.themeInput)
  const outputTypescript = useSelector(
    (state: RootState) => state.editor.outputTypescript
  )
  const [open, setOpen] = useState(false)
  const copyToClipboard = () => {
    let codeToCopy = themeInput
    if (!outputTypescript) {
      // naively strip out typescript (first three lines)
      codeToCopy = [
        `export const themeOptions = {`,
        ...themeInput.split("\n").slice(3),
      ].join("\n")
    }
    navigator.clipboard.writeText(codeToCopy).then(() => setOpen(true))
  }

  return (
    <>
      <Tooltip title="Copy theme code">
        <IconButton color="primary" onClick={copyToClipboard}>
          <FileCopyIcon />
        </IconButton>
      </Tooltip>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setOpen(false)}
      >
        <Alert variant="filled" severity="success">
          Copied theme code to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}
