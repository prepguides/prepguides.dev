# PrepGuides Diagrams Index

## 📊 Available Diagrams

### Kubernetes
| Diagram | File | Use Cases | Interview Focus |
|---------|------|-----------|-----------------|
| **Request Flow** | `k8s_request_flow.svg` | System design, troubleshooting, architecture | Network flow, service discovery, load balancing |

### Networking
| Diagram | File | Use Cases | Interview Focus |
|---------|------|-----------|-----------------|
| **OSI 7-Layer Model** | `osi_layers.svg` | Network fundamentals, troubleshooting, protocols | Layer functions, data flow, protocol understanding |

## 🎯 Interview Categories

### System Design Interviews
- **Kubernetes Request Flow**: Essential for explaining how microservices communicate in a containerized environment
- **OSI 7-Layer Model**: Fundamental for understanding network architecture and communication protocols
- **Use Cases**: 
  - "Design a scalable web application"
  - "How would you handle traffic spikes?"
  - "Explain the architecture of your current system"
  - "How does data flow through your system?"

### Technical Deep Dives
- **Kubernetes Request Flow**: Perfect for explaining complex networking concepts
- **OSI 7-Layer Model**: Essential for understanding how different network protocols work together
- **Use Cases**:
  - "Walk me through what happens when a user makes a request"
  - "How does service discovery work?"
  - "Explain the role of each Kubernetes component"
  - "How does data flow through the OSI layers?"
  - "What's the difference between TCP and UDP?"

### Troubleshooting Scenarios
- **Kubernetes Request Flow**: Helps identify failure points and debugging strategies
- **OSI 7-Layer Model**: Provides systematic approach to network troubleshooting
- **Use Cases**:
  - "A user reports the application is slow, how do you debug?"
  - "Requests are failing, where would you look first?"
  - "How do you monitor a Kubernetes application?"
  - "A user can't connect to the server, which layers would you check?"
  - "How do you debug network connectivity issues?"

## 🚀 Quick Reference

### For Kubernetes Interviews
1. **Start with the big picture**: External client → Load balancer → Ingress → Service → Pod
2. **Explain each component**: What it does, why it's needed, how it works
3. **Cover the control plane**: API server, etcd, scheduler, controller manager
4. **Discuss scaling**: HPA, VPA, cluster autoscaler
5. **Security aspects**: RBAC, network policies, secrets management

### For Networking Interviews
1. **Start with OSI layers**: Application → Presentation → Session → Transport → Network → Data Link → Physical
2. **Explain data flow**: Encapsulation (down) and decapsulation (up)
3. **Cover key protocols**: HTTP, TCP, IP, Ethernet
4. **Discuss troubleshooting**: Layer-by-layer debugging approach
5. **Security aspects**: Encryption, authentication, network segmentation

### Common Follow-up Questions
- "What happens if the ingress controller fails?"
- "How would you implement canary deployments?"
- "Explain the difference between a Service and an Ingress"
- "How does kube-proxy implement load balancing?"
- "What's the role of etcd in this flow?"
- "What's the difference between a switch and a router?"
- "How does ARP work?"
- "Explain the difference between HTTP and HTTPS"
- "What's the purpose of port numbers?"
- "How does NAT work and why is it used?"

## 📈 Future Diagrams (Planned)

### Networking
- [x] OSI Model Layers
- [ ] TCP/IP Stack
- [ ] Load Balancer Types
- [ ] CDN Architecture
- [ ] DNS Resolution Flow

### Databases
- [ ] Database Replication
- [ ] Sharding Strategies
- [ ] ACID Properties
- [ ] CAP Theorem
- [ ] Database Indexing

### Microservices
- [ ] Service Mesh Architecture
- [ ] API Gateway Pattern
- [ ] Circuit Breaker Pattern
- [ ] Event-Driven Architecture
- [ ] Saga Pattern

### System Design
- [ ] High-Level Architecture
- [ ] Scalability Patterns
- [ ] Caching Strategies
- [ ] Message Queues
- [ ] Distributed Systems

## 💡 Usage Tips

1. **Study the complete flow**: Don't just memorize individual components
2. **Practice explaining**: Use the diagrams to practice verbal explanations
3. **Understand failures**: Know what happens when each component fails
4. **Scale considerations**: Think about how the system behaves under load
5. **Security implications**: Understand security at each layer

## 🔄 Diagram Updates

This index will be updated as new diagrams are added. Each diagram includes:
- Visual representation (SVG format)
- Detailed description file
- Interview questions
- Troubleshooting scenarios
- Key concepts explanation

---

*Last updated: $(date)*
