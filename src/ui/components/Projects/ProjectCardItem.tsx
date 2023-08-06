import { useEffect, useState } from "react";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { CanisterStatusResponse, DefiniteCanisterSettings, Project } from "types/project";

import Link from "ui/Link";

import { useRecoilState, useRecoilValue } from "recoil";
import { projectShowState, projectState } from "states/setProjectsState";
import { canisterId___Candid_UI_canister, host } from "hooks/useCanister";
import { handleChangeStatus, handleChangeFile } from "hooks/useCanister";
import { useAuth } from "hooks/auth";
import { Principal } from "@dfinity/principal";
import { Identity } from "@dfinity/agent";

type Props = {
  index: Number;
  project: Project;
}

function ProjectCardItem(props: Props): EmotionJSX.Element {
  const { principal, identity } = useAuth();

  // project data settings >>>
  const index = props.index as number;
  const project = props.project as Project;
  const candidUiURL = `${host}/?canisterId=${canisterId___Candid_UI_canister}&id=${project.canister_id}`;
  // <<< project data settings

  // managing progect and canister state >>>
  const [isProjectStatus, setProjectStatus] = useState<String>();
  const [isCreatedCanister, setCreatedCanister] = useState<CanisterStatusResponse>();
  const [isChangeStatus, setChangeStatus] = useState<String>();
  const [isCanisterSettings, setCanisterSettings] = useState<DefiniteCanisterSettings>();
  const [isCandidUiURL, setCandidUiURL] = useState<String>("");

  useEffect(() => {
    if (project.created_canister.length > 0 && project.created_canister[0]) {
      setCreatedCanister(project.created_canister[0]);
      setProjectStatus(Array.from(Object.entries(project.created_canister[0].status))[0][0]);
      switch (Array.from(Object.entries(project.created_canister[0].status))[0][0]) {
        case 'running': setChangeStatus('Stop'); break;
        case 'stopping': setChangeStatus('Wait'); break;
        case 'stopped': setChangeStatus('Start'); break;
      }
      if (project.created_canister[0].settings) {
        setCanisterSettings(project.created_canister[0].settings);
      }
      if (project.created_canister[0].module_hash && project.created_canister[0].module_hash.length > 0) setCandidUiURL(candidUiURL);
    }
  }, [project])
  // <<< managing progect and canister state

  // managing projectList state >>>
  const [isProjects, setProjects] = useRecoilState(projectState);
  const [isShowProjects, setShowProjects] = useRecoilState(projectShowState);
  useEffect(() => {
    const projectElements = document.querySelectorAll(".project");
    let sliceCount = projectElements.length;
    const updateProjects = new Map(Array.from(isProjects.entries()).slice(0, sliceCount));
    if (updateProjects !== isShowProjects) setShowProjects(updateProjects);
  }, [isProjects]);
  // <<< managing projectList state

  // managing project state >>>
  const [isFile, setFile] = useState();
  const [isFileName, setFileName] = useState();

  const excuteHandleChangeFile = (e_handle: any) => {
    handleChangeFile(e_handle, setFile, setFileName, setProjects, identity as Identity);
  }

  const excuteHandleChangeStatus = (e_handle: any) => {
    handleChangeStatus(e_handle, setProjects, identity as Identity);
  }
  // <<< managing project state


  return (
    <Grid
      item
      width='100%'
      minHeight='100px'
      className='project'
      sm={12} md={6} xl={4}
      sx={{
        display: 'auto',
        justifyContent: 'center',
        alignItems: "center",
      }}
    >
      <Card
        id={project.canister_id.toText()}
      >
        <CardActionArea >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '100px'
            }} >
            <Typography variant="h6" width='8%'>{index + 1}</Typography>
            {project.logo_url ? (
              <CardMedia
                component="img"
                image={project.logo_url as string}
                alt={project.project_name as string}
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  borderRadius: "30px",
                }}
              />
            ) : (
              ""
            )}
            <Box px={3}>
              <Typography variant='h6' gutterBottom>
                <strong>{project.project_name}</strong>
              </Typography>
              <ListItem
                className="candid_url"
                key="candid_url"
                component={isCandidUiURL.indexOf("http") !== -1 ? Link : "div"}
                target='_blank'
                href={String(isCandidUiURL)}
              >
                <ListItemText primary={String(isCandidUiURL)} sx={{ marginLeft: '4px' }} />
              </ListItem>
            </Box>
            {isCanisterSettings && principal && (isCanisterSettings.controllers.filter(v => v.toString() === principal.toString()).length > 0) && isCandidUiURL.length <= 0 ? (
              <Button variant="contained" component="label" >
                Upload
                <input hidden accept=".wasm,.gz" multiple type="file" onChange={excuteHandleChangeFile} alt={project.canister_id.toString()} />
              </Button>
            ) : ("")}
          </CardContent>
        </CardActionArea>
        {project.description ? (
          <Accordion sx={{ borderStyle: 'solid', borderColor: 'silver' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Show more</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {project.description}
              </Typography>
              {isCreatedCanister ? (Array.from(project.created_canister.values()).map((created_canister, index) => (
                <Box>
                  <Typography variant="h6" >canister id: {project.canister_id.toText()}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }} >
                    <Typography variant="h6" px={2} sx={{ paddingLeft: '0px' }}>status: {isProjectStatus}</Typography>
                    {isCanisterSettings && principal && (isCanisterSettings.controllers.filter(v => v.toString() === principal.toString()).length > 0) ? (
                      <Button
                        className="change_project_status"
                        variant="contained"
                        disabled={false}
                        value={project.canister_id.toText()}
                        onClick={excuteHandleChangeStatus}
                        color={isProjectStatus && isProjectStatus === 'running' ? "error" : "primary"}
                        size="small"
                      >
                        {isChangeStatus}
                      </Button>
                    ) : ("")}
                  </Box>
                  <Typography variant="h6" >memory_size: {String(created_canister.memory_size)}</Typography>
                  <Typography variant="h6" >cycles: {String(created_canister.cycles)}</Typography>
                  {isCanisterSettings && isCanisterSettings.controllers.length > 0 ? isCanisterSettings.controllers.map((principalID, index) => (
                    <Typography variant="h6" >controller {index}: {principalID.toString()}</Typography>
                  )) : ("")}
                </Box>
              ))) : (
                ""
              )}
            </AccordionDetails>
          </Accordion>
        ) : (
          ""
        )}
      </Card>
    </Grid >
  );
}

export default ProjectCardItem;