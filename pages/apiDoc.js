import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"


export default function App({ spec }) {
  return <SwaggerUI url={"/userAPI.yaml"} />
 
}

