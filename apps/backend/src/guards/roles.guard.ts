import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ROLES_KEY } from "../decorators/roles.decorator"
import { UserRoleEnum } from "../modules/users/enums/user-role.enum"
import { UserRequest } from "../modules/common/types/user-request.type"

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		)

		if (!requiredRoles) return true // нет ограничений — пропускаем

		const { user } = context.switchToHttp().getRequest<UserRequest>()
		if (!requiredRoles.includes(user.role)) {
			throw new ForbiddenException("Недостаточно прав")
		}

		return true
	}
}
