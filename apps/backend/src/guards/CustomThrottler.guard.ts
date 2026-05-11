import { ThrottlerGuard, ThrottlerException } from "@nestjs/throttler"
import { Injectable } from "@nestjs/common"

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
	protected throwThrottlingException(): Promise<void> {
		throw new ThrottlerException("Too Many Requests. Please try again later.")
	}
}
