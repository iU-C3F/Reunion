import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Dapp, Social } from "types/dapp";

type Props = {
  index: Number;
  dapp: Dapp;
}

const DappCardItem = (props: Props): EmotionJSX.Element => {
  const index = props.index as number;
  const dapp = props.dapp as Dapp;
  let webSiteUrl: string = "";
  dapp.data_social.map((social: Social) => {
    if (social.name === "Website") {
      webSiteUrl = social.url as string;
    }
  })

  return (
    <Grid
      item
      width='100%'
      minHeight='100px'
      className='dapp-root'
      sm={12} md={6} xl={4}
      sx={{
        display: 'auto',
        justifyContent: 'center',
        alignItems: "center",
      }}
    >
      <Card
        key={index}
      // style={{
      //   display: 'auto',
      // }}
      >
        <CardActionArea href={webSiteUrl}>
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '100px'
            }} >
            {dapp.logo_url ? (
              <CardMedia
                component="img"
                image={dapp.logo_url as string}
                alt={dapp.project_name as string}
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
                <strong>{dapp.project_name}</strong>
              </Typography>
              {dapp.category_list && dapp.category_list.length > 0 ? (
                <Typography variant="h6" >Categories: </Typography>
              ) : (
                ""
              )}
              <Grid
                container
                className='category-list'
                columnSpacing={1}
                rowSpacing={1}
                sx={{
                  justifyContent: 'left',
                  alignItems: 'left',
                  margin: '5px'
                }}
              >
                {dapp.category_list && dapp.category_list.length > 0 && dapp.category_list.map((category) => (
                  <Button size="small" variant="outlined">{category}</Button>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </CardActionArea>
        {dapp.data_social && dapp.data_social.length > 0 ? (
          <Typography variant="h6" maxWidth='sm' margin='5px'>Social Links: </Typography>
        ) : (
          ""
        )}
        <Box px={3}>
          <Grid
            container
            className='social-list'
            columnSpacing={1}
            rowSpacing={1}
            sx={{
              justifyContent: 'flex-start',
              alignItems: 'left',
              margin: '8px'
            }}
          >
            {dapp.data_social && dapp.data_social.length > 0 && dapp.data_social.map((social) => (
              <Button size="small" variant="outlined" href={social.url as string} >{social.name}</Button>
            ))}
          </Grid>
        </Box>
        {dapp.description ? (
          <Accordion >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Show more</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {dapp.description}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ) : (
          ""
        )}
      </Card>
    </Grid>
  );
}

export default DappCardItem;