'use client';

import { ROLES } from '@/constants';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export function useRole() {
  const { data: session } = useSession();

  const isAdmin = useMemo(() => {
    return _.isEqual(
      session?.user?.role.toLowerCase(),
      ROLES.admin.toLowerCase()
    );
  }, [session?.user?.role]);

  const isStaff = useMemo(() => {
    return _.isEqual(
      session?.user?.role.toLowerCase(),
      ROLES.staff.toLowerCase()
    );
  }, [session?.user?.role]);

  const isJudge = useMemo(() => {
    return _.isEqual(
      session?.user?.role.toLowerCase(),
      ROLES.judge.toLowerCase()
    );
  }, [session?.user?.role]);

  return {
    isAdmin,
    isStaff,
    isJudge
  };
}
