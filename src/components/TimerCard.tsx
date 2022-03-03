import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";

export default function TimerCard() {
  return (
    <Card sx={{ minWidth: 320, maxWidth: 320 }}>
      <CardHeader
        title="Test"
        action={
          <IconButton aria-label="Modify timer">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        }
      />
      <CardContent>
        <Typography>Test</Typography>
      </CardContent>
    </Card>
  );
}
