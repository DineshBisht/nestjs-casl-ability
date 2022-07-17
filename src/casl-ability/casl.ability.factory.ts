import { Ability, AbilityBuilder } from '@casl/ability';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CaslAbilityFactory {
  defineAbilityFor(user) {
    if (user) {
      return new Ability(this.defineRulesFor(user));
    }
  }

  defineRulesFor(user) {
    const builder = new AbilityBuilder(Ability);

    switch (user.role) {
      case 'Admin':
        this.defineAdminRule(builder);
        break;
      case 'User':
        this.defineUserRole(builder, user);
        break;
      default:
        this.defineAnonymousRules(builder);
        break;
    }

    return builder.rules;
  }

  defineAdminRule({ can }) {
    can('manage', 'all');
  }

  defineUserRole({ can, cannot }, user) {
    can('read', 'Project');
    can('update', 'Project', { user: user.id });
    can('delete', 'Project', { user: user.id });
  }
  defineAnonymousRules({ cannot }) {
    cannot(['read', 'create', 'update', 'delete'], ['Project', 'Invoce']);
  }
}
