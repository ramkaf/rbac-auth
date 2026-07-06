import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder()
    .setTitle("RBAC Authentication API")
    .setDescription(
      "A scalable NestJS backend providing authentication (JWT), role-based access control (RBAC), " +
        "fine-grained permission system, and user-role management. " +
        "Includes dynamic permission guards, controller-level authorization, and seeder-based initialization.",
    )
    .setVersion("1.0")
    .addTag("authentication")
    .addTag("permissions")
    .addTag("roles")
    .addTag("user managment")
    .addTag("sample")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
