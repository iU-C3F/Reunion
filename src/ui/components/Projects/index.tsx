import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Container } from '@mui/system';
import { Box, Button, Grid, Typography } from '@mui/material';

import ProjectCardItem from 'ui/components/Projects/ProjectCardItem';
import { useIntersection } from 'hooks/intersection';
import { Project, Projects } from 'types/project';
import { useRecoilState, useRecoilValue } from 'recoil';
import { projectState, projectShowState } from 'states/setProjectsState';

import { User } from "types/user";
import { setUserStates } from "states/setUserStates";
import { localStorageUserState } from "states/localstorage";
import { sessionStorageUserState } from "states/sessionstorage";

import { makeManagementCanisterActor } from 'ui/service/actor-locator';
import { Identity } from "@dfinity/agent";
import Auth from '../Auth';
import { useAuth } from 'hooks/auth';

// function for projects >>>
export async function getProjects(identity: Identity) {
  console.log("inner getProjects >>>>>>");
  let managementCanisterActor = makeManagementCanisterActor(identity);
  // if (isUser) {
  //   console.log("inner if isUser:", isUser);
  //   managementCanisterActor = makeManagementCanisterActor(isUser.identity as Identity);
  // }
  console.log("managementCanisterActor:", managementCanisterActor);
  console.log("<<<<<< inner getProjects");

  const projects_result = await managementCanisterActor.get_canister_values();
  const projects: Projects = new Map(Object.entries(projects_result));
  return projects;
}
// <<< function for projects

export default function ProjectList() {
  const { isAuthenticated, identity } = useAuth();
  // setting state >>>
  // state for projects >>>>>>
  const [isProjects, setProjects] = useRecoilState(projectState);
  const [isShowProjects, setShowProjects] = useRecoilState(projectShowState);
  // <<<<<< state for projects
  // state for intersection >>>>>>
  const ref = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const intersection = useIntersection(ref);
  const [intersected, setIntersected] = useState<boolean>(true);
  const [showMore, setShowMore] = useState<boolean>(true);
  // <<<<<< state for intersection
  // state for user >>>>>>
  const [isClient, setIsClient] = useState(false);
  const isLocalUser = useRecoilValue<User>(localStorageUserState);
  const isSessionUser = useRecoilValue<User>(sessionStorageUserState);
  const [isUser, setUser] = useState<User>();
  const [isEnv, setEnv] = useState("");
  // <<<<<< state for user
  // <<< setting state

  // effect for projects >>>
  // useEffect(() => {
  //   if (window) {
  //     setShowMore(true);
  //     getProjects(isUser)
  //       .then((projects: Projects) => {
  //         setProjects(projects)
  //         if (Array.from(projects.values()).length > 20) {
  //           setShowProjects(new Map(Array.from(projects.entries()).slice(0, 20)));
  //         } else {
  //           setShowMore(false);
  //           setShowProjects(projects);
  //         }
  //       })
  //       .catch((err: any) => console.log("getProjects error: ", err))
  //   }
  // }, [])
  // <<< effect for projects

  // effect for user >>>
  useEffect(() => {
    setUserStates(isClient, isLocalUser, isSessionUser, setUser, setEnv);
    if (window) {
      setShowMore(true);
      console.log("isUser: ", isUser);
      if (isAuthenticated && identity) {
        getProjects(identity)
          .then((projects: Projects) => {
            setProjects(projects)
            if (Array.from(projects.values()).length > 20) {
              setShowProjects(new Map(Array.from(projects.entries()).slice(0, 20)));
            } else {
              setShowMore(false);
              setShowProjects(projects);
            }
          })
          .catch((err: any) => console.log("getProjects error: ", err))
      }
    }
  }, [isClient, isUser, isLocalUser, isSessionUser, isEnv]);

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);
  // <<< effect for user


  // >>> 最下段までスクロールしたらIC Projects のCardを追加で読み込むための処理
  useEffect(() => {
    setIntersected(intersection);
  }, [intersection]);

  useEffect(() => {
    if (intersected && showMore) {
      onButtonClick();
    }
  }, [intersected, showMore]);

  const onButtonClick = async () => {
    if (!isProjects || !isShowProjects) return;
    getProjects(identity as Identity)
      .then((projects: Map<string, Project>) => {
        if (projects === isShowProjects) {
          setShowMore(false);
          return;
        }

        if (Array.from(projects.values()).length > 20) {
          const isShowProjectsLength = Array.from(isShowProjects.values()).length
          let sliceCount = isShowProjectsLength + 10;
          setShowMore(true);
          if (Array.from(projects.values()).length <= sliceCount) {
            sliceCount = Array.from(projects.values()).length;
            setShowMore(false);
          };
          setShowProjects(new Map(Array.from(projects.entries()).slice(0, sliceCount)));
        } else {
          setShowProjects(projects);
        }
      })
      .catch((err: any) => console.log("getProjects error: ", err))
  }
  // <<< 最下段までスクロールしたらIC Projects のCardを追加で読み込むための処理

  return (
    <>
      <Container sx={{ direction: "column", flex: '1' }}>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant='h3'>
            <strong>Project List</strong>
          </Typography>
        </Box>
        <Grid
          className='projects-list'
          columnSpacing={1}
          rowSpacing={1}
          maxHeight='80%'
        >
          {isShowProjects ? (Array.from(isShowProjects.values()).map((project, index) => (
            <Box>
              <ProjectCardItem index={index} project={project} />
            </Box>
          ))
          ) : (
            <Typography variant='h4'>Progect Not Found...</Typography>
          )}

          <div ref={ref}>
            {showMore && (
              <Button variant='text' onClick={async () => await onButtonClick()}>Load More Projects...</Button>
            )}
          </div>
          <Box sx={{ height: '80px' }} />{/* 画面下部のカードがfooterに隠れてしまうので、底上げ用のBoxを設置 */}

        </Grid>
      </Container>
    </>
  )
}
