import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [
				`.env/${process.env.NODE_ENV}.env`,
				'.env/default.env',
			],
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: 5432,
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			autoLoadEntities: true,
			synchronize: true,
		}),
		UserModule,
		AuthModule,
		AdminModule,
	],
	providers: [],
})
export class AppModule {}
