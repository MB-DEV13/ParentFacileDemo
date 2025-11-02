import{r as e}from"./index-DzDZ6tjL.js";function d(a,u=[]){const[n,o]=e.useState(null),[f,s]=e.useState(!0),[i,l]=e.useState(null);return e.useEffect(()=>{let t=!0;return s(!0),a().then(r=>{t&&o(r)}).catch(r=>{t&&l(r)}).finally(()=>{t&&s(!1)}),()=>{t=!1}},u),{data:n,loading:f,error:i}}export{d as u};
//# sourceMappingURL=useApi-DpnssBU5.js.map
