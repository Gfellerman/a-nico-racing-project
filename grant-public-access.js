'use strict';

module.exports = async () => {
  try {
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });

    if (publicRole) {
      const projectPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
        where: {
          'action': {
            $in: ['api::project.project.find', 'api::project.project.findOne'],
          },
        },
      });

      const existingPermissions = publicRole.permissions ? publicRole.permissions.map(p => p.id) : [];

      await strapi.query('plugin::users-permissions.role').update({
        where: { id: publicRole.id },
        data: {
          permissions: [...new Set([...existingPermissions, ...projectPermissions.map(p => p.id)])],
        },
      });

      console.log('Successfully granted public access to the project content type.');
    } else {
      console.log('Could not find the public role.');
    }
  } catch (error) {
    console.error('Error granting public access:', error);
  }
};
