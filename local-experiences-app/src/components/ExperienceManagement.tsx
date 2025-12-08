import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge } from 'react-bootstrap';
import { experienceService } from '../services/experienceService';
import type { Experience, CreateExperienceData } from '../types/Experience';
import { toast } from 'react-toastify';

export function ExperienceManagement() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateExperienceData>({
    name: '', description: '', category: 'Aventura', price: 0, 
    location: '', date: '', maxCapacity: 10, images: []
  });

  const loadExperiences = async () => {
    try {
      const data = await experienceService.getMyExperiences();
      setExperiences(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar experiencias");
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
        const data = await experienceService.getMyExperiences();
        if (!ignore) setExperiences(data);
    };

    fetchData();

    return () => { ignore = true; };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await experienceService.createExperience(formData);
      toast.success("Experiencia creada con éxito");
      setShowModal(false);
      loadExperiences();
    } catch (error) {
        console.error(error);
      toast.error("Error al crear experiencia");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta experiencia?')) {
      try {
        await experienceService.deleteExperience(id);
        toast.success("Experiencia eliminada");
        loadExperiences();
      } catch (error) {
          console.error(error);
        toast.error("Error al eliminar");
      }
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Experiencias</h2>
        <Button onClick={() => setShowModal(true)}>+ Nueva Experiencia</Button>
      </div>

      <Card>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Precio</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map(exp => (
              <tr key={exp.id}>
                <td>{exp.name} <br/> <small className="text-muted">{exp.category}</small></td>
                <td>{new Date(exp.date).toLocaleDateString()}</td>
                <td>${exp.price}</td>
                <td>
                  <Badge bg="info">{exp.currentCapacity}/{exp.maxCapacity}</Badge>
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(exp.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
            {experiences.length === 0 && (
                <tr><td colSpan={5} className="text-center">No tienes experiencias creadas.</td></tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* Modal de Creación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Nueva Experiencia</Modal.Title></Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control required onChange={e => setFormData({...formData, name: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option>Aventura</option><option>Gastronomía</option><option>Cultura</option>
                    </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={3} required onChange={e => setFormData({...formData, description: e.target.value})} />
            </Form.Group>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control type="number" required onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Capacidad Máx</Form.Label>
                        <Form.Control type="number" required onChange={e => setFormData({...formData, maxCapacity: parseInt(e.target.value)})} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control type="datetime-local" required onChange={e => setFormData({...formData, date: e.target.value})} />
                    </Form.Group>
                </Col>
            </Row>
             <Form.Group className="mb-3">
                <Form.Label>Ubicación</Form.Label>
                <Form.Control required onChange={e => setFormData({...formData, location: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}