// Agent Store - Zustand State Management

import { create } from 'zustand';
import { Agent, AgentStatus, AgentSkill } from '../types';
import { mockAgents, getAgentById } from '../services/mockData';

interface AgentState {
    // Data
    agents: Agent[];
    currentAgentId: string | null;

    // Computed
    currentAgent: Agent | null;
    onlineAgents: Agent[];
    availableAgents: Agent[];

    // Actions
    setAgents: (agents: Agent[]) => void;
    setCurrentAgent: (agentId: string | null) => void;
    updateAgentStatus: (agentId: string, status: AgentStatus) => void;
    updateAgentLoad: (agentId: string, load: number) => void;
    getAgentsBySkill: (skill: AgentSkill) => Agent[];

    // Routing
    findBestAgent: (requiredSkills: AgentSkill[]) => Agent | null;
}

export const useAgentStore = create<AgentState>((set, get) => ({
    // Initial Data
    agents: mockAgents,
    currentAgentId: 'agent-1', // Default logged-in agent

    // Computed Properties
    get currentAgent() {
        const state = get();
        return state.currentAgentId
            ? state.agents.find(a => a.id === state.currentAgentId) || null
            : null;
    },

    get onlineAgents() {
        return get().agents.filter(a => a.isOnline && a.status !== AgentStatus.OFFLINE);
    },

    get availableAgents() {
        return get().agents.filter(
            a => a.isOnline &&
                a.status === AgentStatus.ONLINE &&
                a.currentLoad < a.maxLoad
        );
    },

    // Actions
    setAgents: (agents) => set({ agents }),

    setCurrentAgent: (agentId) => set({ currentAgentId: agentId }),

    updateAgentStatus: (agentId, status) => set((state) => ({
        agents: state.agents.map(agent =>
            agent.id === agentId
                ? {
                    ...agent,
                    status,
                    isOnline: status !== AgentStatus.OFFLINE,
                    lastActiveAt: new Date()
                }
                : agent
        )
    })),

    updateAgentLoad: (agentId, load) => set((state) => ({
        agents: state.agents.map(agent =>
            agent.id === agentId
                ? {
                    ...agent,
                    currentLoad: Math.min(load, agent.maxLoad),
                    status: load >= agent.maxLoad ? AgentStatus.BUSY : agent.status
                }
                : agent
        )
    })),

    getAgentsBySkill: (skill) => {
        return get().agents.filter(agent => agent.skills.includes(skill));
    },

    // Smart Routing - Find best agent based on skills, load, and performance
    findBestAgent: (requiredSkills) => {
        const availableAgents = get().availableAgents;

        // Filter agents with matching skills
        const matchingAgents = availableAgents.filter(agent =>
            requiredSkills.some(skill => agent.skills.includes(skill))
        );

        if (matchingAgents.length === 0) {
            // No skill match, return any available agent
            return availableAgents[0] || null;
        }

        // Score agents based on:
        // 1. Skill match count (higher is better)
        // 2. Current load (lower is better)
        // 3. Performance score (higher is better)
        const scoredAgents = matchingAgents.map(agent => {
            const skillMatchCount = requiredSkills.filter(skill =>
                agent.skills.includes(skill)
            ).length;

            const loadScore = 1 - (agent.currentLoad / agent.maxLoad);
            const performanceScore = agent.performanceScore / 100;

            const totalScore = (skillMatchCount * 0.4) + (loadScore * 0.35) + (performanceScore * 0.25);

            return { agent, score: totalScore };
        });

        // Sort by score descending
        scoredAgents.sort((a, b) => b.score - a.score);

        return scoredAgents[0]?.agent || null;
    }
}));
