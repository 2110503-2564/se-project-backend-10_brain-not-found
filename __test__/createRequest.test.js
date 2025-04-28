// Mock the models as needed
jest.mock('../models/Request');
jest.mock('../models/User');

const { createRequest } = require('../controllers/requests');
const Request = require('../models/Request');

// Test suite for createRequest function
describe('createRequest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should reject if user role is not shopOwner', async () => {
        const req = {
            user: { id: 'user123', role: 'admin' },
            body: { shop: { name: 'Test Shop' } }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await createRequest(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should create a request when user role is shopOwner', async () => {
        const req = {
            user: { id: 'shopOwner123', role: 'shopOwner' },
            body: { shop: { name: 'Test Shop', address: '123 Main St' } }
        };
        const fakeRequest = { _id: 'req123', ...req.body, user: req.user.id };
        Request.create.mockResolvedValue(fakeRequest);
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await createRequest(req, res);
        expect(Request.create).toHaveBeenCalledWith(expect.objectContaining({ shop: req.body.shop, user: req.user.id }));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: fakeRequest });
    });
    
    it('should cover the catch block in createRequest', async () => {
        const req = {
            user: { id: 'shopOwner123', role: 'shopOwner' },
            body: { shop: { name: 'Test Shop', address: '123 Main St' } }
        };
        // Force Request.create to throw an error
        Request.create.mockRejectedValue(new Error('Test error'));
        // Spy on console.log to check the error is logged
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await createRequest(req, res);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
