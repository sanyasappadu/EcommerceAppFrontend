import { useEffect, useState } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import BookmarkAdd from "@mui/icons-material/BookmarkAddOutlined";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const url = "http://localhost:4000";

export default function ResponsiveGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${url}/api/products`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
     <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mr: 50,
          ml: 50,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        {products.map((product) => (
          <Grid item xs={2} sm={4} md={3} m={3} key={product.id}>
            <Item>
              <Card sx={{ width: 450, ml:18 }}>
                <div>
                  <Typography level="title-lg">{product.name}</Typography>
                  <Typography level="body-sm">{product.description}</Typography>
                  <IconButton
                    aria-label={`bookmark ${product.name}`}
                    variant="plain"
                    color="neutral"
                    size="sm"
                    sx={{
                      position: "absolute",
                      top: "0.875rem",
                      right: "0.5rem",
                    }}
                  >
                    <BookmarkAdd />
                  </IconButton>
                </div>
                <AspectRatio >
                  <img
                    style={{width:"260px", marginLeft:"95px"}}
                    src={product.image}
                    srcSet={`${product.image} 2x`}
                    loading="lazy"
                    alt={product.name}
                  />
                </AspectRatio>
                <CardContent orientation="horizontal">
                  <div>
                    <Typography level="body-xs">Price:</Typography>
                    <Typography fontSize="lg" fontWeight="lg">
                      ${product.price}
                    </Typography>
                  </div>
                  <Button
                    variant="solid"
                    size="md"
                    color="primary"
                    aria-label={`Explore ${product.name}`}
                    sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </Item>
          </Grid>
        ))}
      </Box>
    </Box>
  );
}
