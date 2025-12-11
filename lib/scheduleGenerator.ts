import { Assignment, TeamData, Replacement } from '@/types';
import { getWorkDaysInMonth, formatDate } from './dateUtils';
import teamData from '@/data/team.json';
import replacementsData from '@/data/replacements.json';

export function generateScheduleForMonth(year: number, month: number): Assignment[] {
  const workDays = getWorkDaysInMonth(year, month);
  const { rotationOrder } = teamData as TeamData;
  const assignments: Assignment[] = [];
  
  let currentPersonIndex = 0;
  let dayIndex = 0;
  
  while (dayIndex < workDays.length) {
    const personId = rotationOrder[currentPersonIndex];
    
    // Día 1 de guardia (verde claro)
    if (dayIndex < workDays.length) {
      assignments.push({
        date: formatDate(workDays[dayIndex]),
        personId,
        type: 'day1',
        isReplacement: false,
      });
      dayIndex++;
    }
    
    // Día 2 de guardia (verde oscuro)
    if (dayIndex < workDays.length) {
      assignments.push({
        date: formatDate(workDays[dayIndex]),
        personId,
        type: 'day2',
        isReplacement: false,
      });
      dayIndex++;
    }
    
    // Siguiente persona en la rotación
    currentPersonIndex = (currentPersonIndex + 1) % rotationOrder.length;
  }
  
  return applyReplacements(assignments);
}

function applyReplacements(assignments: Assignment[]): Assignment[] {
  const { replacements } = replacementsData as { replacements: Replacement[] };
  const activeReplacements = replacements.filter(r => r.status === 'active');
  
  return assignments.map(assignment => {
    const activeReplacement = activeReplacements.find(r => {
      const dateInRange = isDateInRange(assignment.date, r.startDate, r.endDate);
      return r.originalPersonId === assignment.personId && dateInRange;
    });
    
    if (activeReplacement) {
      return {
        ...assignment,
        originalPersonId: assignment.personId,
        personId: activeReplacement.replacementPersonId,
        isReplacement: true,
        replacementReason: activeReplacement.reason,
      };
    }
    
    return assignment;
  });
}

function isDateInRange(date: string, startDate: string, endDate: string): boolean {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
}

export function getTeamMember(personId: string) {
  const { team } = teamData as TeamData;
  return team.find(member => member.id === personId);
}

export function getAllTeamMembers() {
  const { team } = teamData as TeamData;
  return team;
}