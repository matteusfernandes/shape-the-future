'use client';

import { ROLES, isAdminRole, isSigmaRole } from '@/constants';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export function useRole() {
  const { data: session } = useSession();

  const isAdmin = useMemo(() => {
    return isAdminRole(session?.user?.role);
  }, [session?.user?.role]);

  const isSigma = useMemo(() => {
    return isSigmaRole(session?.user?.role);
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
    isSigma,
    isStaff,
    isJudge
  };
}
