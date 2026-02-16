import 'package:flutter/material.dart';
import '../../services/api_client.dart';

/// RoutineScreen fetches and displays the recommended morning
/// and evening products for the current user.
class RoutineScreen extends StatefulWidget {
  const RoutineScreen({
    super.key,
    required this.authToken,
    required this.skinType,
  });

  final String authToken;
  final String skinType;

  @override
  State<RoutineScreen> createState() => _RoutineScreenState();
}

class _RoutineScreenState extends State<RoutineScreen> {
  final _api = ApiClient();
  bool _isLoading = true;
  String? _error;
  List<dynamic> _morning = [];
  List<dynamic> _evening = [];

  @override
  void initState() {
    super.initState();
    _loadRoutine();
  }

  Future<void> _loadRoutine() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final result = await _api.getRoutine(
        token: widget.authToken,
        skinType: widget.skinType,
      );
      setState(() {
        _morning = (result['morning_products'] as List<dynamic>? ?? []);
        _evening = (result['evening_products'] as List<dynamic>? ?? []);
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Widget _buildProductTile(Map<String, dynamic> product) {
    return ListTile(
      title: Text(product['name'] as String? ?? ''),
      subtitle: Text(product['step_type'] as String? ?? ''),
      trailing: Text(
        product['price'] != null ? '\$${product['price']}' : '',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Routine'),
      ),
      body: SafeArea(
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        _error!,
                        style: const TextStyle(color: Colors.red),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  )
                : RefreshIndicator(
                    onRefresh: _loadRoutine,
                    child: ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        const Text(
                          'Morning',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        if (_morning.isEmpty)
                          const Text('No products in your morning routine yet.')
                        else
                          ..._morning
                              .map((p) => _buildProductTile(p as Map<String, dynamic>))
                              .toList(),
                        const SizedBox(height: 24),
                        const Text(
                          'Evening',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        if (_evening.isEmpty)
                          const Text('No products in your evening routine yet.')
                        else
                          ..._evening
                              .map((p) => _buildProductTile(p as Map<String, dynamic>))
                              .toList(),
                      ],
                    ),
                  ),
      ),
    );
  }
}

