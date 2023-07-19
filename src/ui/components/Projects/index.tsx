import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Container } from '@mui/system';
import { Box, Button, Grid, Typography } from '@mui/material';

import ProjectCardItem from 'ui/components/Projects/ProjectCardItem';
import { useIntersection } from 'hooks/intersection';
import { Project, Projects } from 'types/project';
import { makeManagementCanisterActor } from 'ui/service/actor-locator';
import { useRecoilState } from 'recoil';
import { projectState, projectShowState } from 'states/setProjectsState';

// function for projects >>>
export async function getProjects() {
  const managementCanisterActor = makeManagementCanisterActor();
  const projects_result = await managementCanisterActor.get_canister_values();
  const projects: Projects = new Map(Object.entries(projects_result));
  return projects;
}
// <<< function for projects

export default function ProjectList() {
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
  // <<< setting state

  // effect for projects >>>
  useEffect(() => {
    if (window) {
      setShowMore(true);
      getProjects()
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
  }, [])
  // <<< effect for projects

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
    getProjects()
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
