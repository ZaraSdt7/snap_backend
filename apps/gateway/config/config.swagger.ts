import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from "../src/rest/admin/admin.module";
import { DriverModule } from "../src/rest/driver/driver.module";
import { PassengerModule } from "../src/rest/passenger/passenger.module";
interface SwaggerModuleItem {
    path:string;
    module?:any;
    bearer?:boolean;
}

export function setupSwagger(app:INestApplication , cfg) {
const apiVersion = cfg.get('server.apiVersion');
const swaggerTitle = cfg.get('server.swagger.title');
const swaggerDescription = cfg.get('server.swagger.description');
const swaggerVersion = cfg.get('server.swagger.version');

const mainOptions = new DocumentBuilder()
    .setTitle(`${swaggerTitle} - Admin`)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .addBearerAuth()
    .build();

const mainDocument = SwaggerModule.createDocument(app, mainOptions , {
    include: [AdminModule]
});
SwaggerModule.setup(`/${apiVersion}/docs`, app, mainDocument);
const modules:SwaggerModuleItem[] = [
    { 
        path: 'admin',
        module: AdminModule,
        bearer: false,
    },
    { 
        path: 'driver',
        module: DriverModule,
        bearer: true,
    },
    { 
        path: 'passenger',
        module: PassengerModule,
        bearer: true,
    },
];
modules.forEach(({path, module, bearer}) => {
   let options = new DocumentBuilder()
        .setTitle(`${swaggerTitle} - ${path}`)
        .setDescription(swaggerDescription)
        .setVersion(swaggerVersion)
       if(bearer) {
        options = options.addBearerAuth(
            {type: 'http',
            scheme: 'bearer',  
            bearerFormat: 'JWT',
            name: 'Authorization',
            in: 'header'},
        );
       }
});
}

