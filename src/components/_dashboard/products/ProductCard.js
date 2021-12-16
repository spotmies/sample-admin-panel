import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
// material
import { Box, Card, Link, Typography, Stack, Switch, Menu, MenuItem} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { AiFillEdit,AiFillDelete } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import Label from '../../Label';
import ColorPreview from '../../ColorPreview';
// Root Store
import {useStores} from "../../../state_management/store/index";

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  // objectFit: 'cover', 
  // chang
  objectFit: 'contain',
  position: 'absolute'
});

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right"
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0"
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        )
      }
    }
  }
}));


// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  const { name, cover, price, colors, status, priceSale, isActive, id } = product;

  // Method for Switch
  const [switchChecked, setSwitchChecked] = useState(isActive);

  const handleSwitchStateChange = (event,uId) => {
    
    setSwitchChecked(event.target.checked);
    ProductStore.editProduct(uId,{"isActive":event.target.checked})    
  };

  const {ProductStore} =  useStores()

  // Methods for more menu Option
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteProduct  = ()=>{
    ProductStore.deleteProduct()    
    handleClose()
  }

  // const handleEditProduct  = ()=>{
  //   ProductStore.deleteProduct()    
  //   handleClose()
  // }
 

  


  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            {status}
          </Label>
        )}
        <ProductImgStyle alt={name} src={cover} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Link to="#" color="inherit" underline="hover" component={RouterLink}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Link>
          <div>
            <BsThreeDotsVertical
              id="demo-customized-button"
              aria-controls="demo-customized-menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="contained"
              disableElevation
              onClick={handleClick}
            />
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                "aria-labelledby": "demo-customized-button"
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} disableRipple>
                <AiFillEdit />
                &nbsp;
                Edit
              </MenuItem>
              <MenuItem onClick={handleDeleteProduct} disableRipple>
                <AiFillDelete />
                &nbsp;
                Delete
              </MenuItem>
            </StyledMenu>
          </div>
        </Stack>

        <Switch 
          onChange={(e)=>handleSwitchStateChange(e,id)}
          checked={switchChecked } 
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ColorPreview colors={colors} />
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through'
              }}
            >
              {priceSale && fCurrency(priceSale)}
            </Typography>
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
