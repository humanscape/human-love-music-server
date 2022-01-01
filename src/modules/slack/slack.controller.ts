import { Controller, Put } from '@nestjs/common';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Put('members')
  updateMemberList() {
    return this.slackService.updateMemberList();
  }
}
